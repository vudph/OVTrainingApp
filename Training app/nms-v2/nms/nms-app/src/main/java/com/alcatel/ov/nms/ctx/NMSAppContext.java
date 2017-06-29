package com.alcatel.ov.nms.ctx;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class NMSAppContext implements ApplicationContextAware {

    private static ApplicationContext CONTEXT;

    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        CONTEXT = context;
    }

    public static <I> I getService(Class<? extends I> serviceIF, String id) {
        return CONTEXT.getBean(id, serviceIF);
    }

}
