package com.mkr.revisionmaster

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "UpdatePlugin")
class UpdatePlugin : Plugin() {

    private lateinit var updateManager: UpdateManager

    override fun load() {
        updateManager = UpdateManager(context)
    }

    @PluginMethod
    fun checkForUpdates(call: PluginCall) {
        val isManual = call.getBoolean("isManual", false) ?: false
        updateManager.checkForUpdates(isManual)
        call.resolve()
    }
}
