package com.alcatel.ov.nms.controller;

import java.util.concurrent.CountDownLatch;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResourceEventListenerAdapter;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * {@link Controller} that will return the
 * 
 */
@Controller
public class EventRSrc {

    public static final String EVENT_BROADCAST = "/events";

    private final Logger m_log = LoggerFactory.getLogger(EventRSrc.class);

    @RequestMapping(value = "/events", method = RequestMethod.GET)
    @ResponseBody
    public void registerClient(AtmosphereResource atmosphereResource) {
        this.suspend(atmosphereResource);

        Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup(EVENT_BROADCAST, false);
        if (broadcaster == null) {
            m_log.info("Create broadcaster /events");
            broadcaster = BroadcasterFactory.getDefault().get(EVENT_BROADCAST);
        }

        m_log.info("Add client {} to broadcaster", atmosphereResource.uuid());
        broadcaster.addAtmosphereResource(atmosphereResource);
        atmosphereResource.addEventListener(new OnDisconnectListener());
    }

    /**
     * Mainly used because by the time we try to suspend, the
     * {@link AtmosphereResource} could be yet not suspended
     */
    private void suspend(final AtmosphereResource atmosphereResource) {
        final CountDownLatch latch = new CountDownLatch(1);

        atmosphereResource.addEventListener(new AtmosphereResourceEventListenerAdapter() {
            public void onSuspend(AtmosphereResourceEvent event) {
                latch.countDown();
                atmosphereResource.removeEventListener(this);
            }
        });

        atmosphereResource.suspend(-1);

        try {
            latch.await();
        } catch (InterruptedException e) {
        }
    }

    /**
     * When the browser is shut down
     */
    private static final class OnDisconnectListener extends AtmosphereResourceEventListenerAdapter {

        private final Logger m_log = LoggerFactory.getLogger(EventRSrc.class);

        @Override
        public void onDisconnect(AtmosphereResourceEvent event) {
            m_log.info("Client {} is disconnected", event.getResource().uuid());
        }
    }
}
