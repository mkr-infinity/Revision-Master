package com.mkr.revisionmaster

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Register our custom update plugin
        registerPlugin(UpdatePlugin::class.java)
        
        // Optional: Check for updates on launch if you want it purely native
        // val updateManager = UpdateManager(this)
        // updateManager.checkForUpdates(false)
    }
}
