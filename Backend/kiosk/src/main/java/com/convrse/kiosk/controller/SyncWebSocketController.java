package com.convrse.kiosk.controller;

import com.convrse.kiosk.model.SyncMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SyncWebSocketController {

    @MessageMapping("/sync")
    @SendTo("/topic/sync")
    public SyncMessage processSyncEvent(@Payload SyncMessage message) {
        // Re-broadcasts tab changes, mirror actions & state updates to all STOMP subscribers
        return message;
    }
}