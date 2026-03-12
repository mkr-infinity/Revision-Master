package com.mkr.revisionmaster

import android.app.AlertDialog
import android.app.ProgressDialog
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.core.content.FileProvider
import kotlinx.coroutines.*
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream

/**
 * UpdateManager handles checking for updates from a remote JSON file,
 * detecting device architecture, downloading the correct APK, and initiating installation.
 */
class UpdateManager(private val context: Context) {

    private val client = OkHttpClient()
    // URL to the update.json file on GitHub
    private val updateUrl = "https://raw.githubusercontent.com/mkr_infinity/Revision-Master/main/updates/update.json"
    
    /**
     * Checks for updates.
     * @param isManual If true, shows a toast if no update is found or if an error occurs.
     */
    fun checkForUpdates(isManual: Boolean = false) {
        if (isManual) {
            Toast.makeText(context, "Checking for updates...", Toast.LENGTH_SHORT).show()
        }
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = Request.Builder().url(updateUrl).build()
                val response = client.newCall(request).execute()
                if (!response.isSuccessful) throw Exception("Failed to fetch update info: ${response.code}")
                
                val jsonStr = response.body?.string() ?: return@launch
                val json = JSONObject(jsonStr)
                
                val remoteVersionCode = json.getInt("versionCode")
                val remoteVersionName = json.getString("versionName")
                val changelog = json.getString("changelog")
                
                val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
                val currentVersionCode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    packageInfo.longVersionCode.toInt()
                } else {
                    packageInfo.versionCode
                }

                if (remoteVersionCode > currentVersionCode) {
                    withContext(Dispatchers.Main) {
                        showUpdateDialog(remoteVersionName, changelog, json.getJSONObject("apks"))
                    }
                } else if (isManual) {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(context, "Revision Master is up to date", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                Log.e("UpdateManager", "Error checking updates", e)
                if (isManual) {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(context, "Update check failed: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun showUpdateDialog(versionName: String, changelog: String, apks: JSONObject) {
        AlertDialog.Builder(context)
            .setTitle("Update Available (v$versionName)")
            .setMessage("What's New:\n$changelog")
            .setCancelable(true)
            .setPositiveButton("Update Now") { _, _ ->
                try {
                    val downloadUrl = getDownloadUrlForArchitecture(apks)
                    startDownload(downloadUrl)
                } catch (e: Exception) {
                    Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
            .setNegativeButton("Later", null)
            .show()
    }

    /**
     * Detects the best APK URL based on device architecture (ABI).
     */
    private fun getDownloadUrlForArchitecture(apks: JSONObject): String {
        val abis = Build.SUPPORTED_ABIS
        for (abi in abis) {
            if (apks.has(abi)) {
                Log.d("UpdateManager", "Found matching ABI: $abi")
                return apks.getString(abi)
            }
        }
        
        // Fallback logic
        return when {
            apks.has("universal") -> apks.getString("universal")
            apks.keys().hasNext() -> {
                val firstKey = apks.keys().next()
                Log.w("UpdateManager", "No matching ABI found, falling back to $firstKey")
                apks.getString(firstKey)
            }
            else -> throw Exception("No download URLs found in update.json")
        }
    }

    private fun startDownload(url: String) {
        val progressDialog = ProgressDialog(context).apply {
            setTitle("Downloading Update")
            setMessage("Downloading the latest version of Revision Master...")
            setProgressStyle(ProgressDialog.STYLE_HORIZONTAL)
            setCancelable(false)
            max = 100
            show()
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = Request.Builder().url(url).build()
                val response = client.newCall(request).execute()
                if (!response.isSuccessful) throw Exception("Download failed: ${response.code}")
                
                val body = response.body ?: throw Exception("Empty response body")
                
                // Use external cache dir so we don't need storage permissions on newer Android versions
                val file = File(context.externalCacheDir, "revision_master_update.apk")
                if (file.exists()) file.delete()
                
                val outputStream = FileOutputStream(file)
                val inputStream = body.byteStream()
                
                val buffer = ByteArray(8192)
                var bytesRead: Int
                var totalBytesRead = 0L
                val contentLength = body.contentLength()

                while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                    outputStream.write(buffer, 0, bytesRead)
                    totalBytesRead += bytesRead
                    
                    if (contentLength > 0) {
                        val progress = (totalBytesRead * 100 / contentLength).toInt()
                        withContext(Dispatchers.Main) {
                            progressDialog.progress = progress
                        }
                    }
                }
                
                outputStream.flush()
                outputStream.close()
                inputStream.close()

                withContext(Dispatchers.Main) {
                    progressDialog.dismiss()
                    installApk(file)
                }
            } catch (e: Exception) {
                Log.e("UpdateManager", "Download failed", e)
                withContext(Dispatchers.Main) {
                    progressDialog.dismiss()
                    Toast.makeText(context, "Download failed: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun installApk(file: File) {
        try {
            val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Log.e("UpdateManager", "Installation failed", e)
            Toast.makeText(context, "Failed to open installer: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
        }
    }
}
