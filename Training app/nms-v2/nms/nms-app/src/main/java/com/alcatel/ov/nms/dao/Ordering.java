package com.alcatel.ov.nms.dao;

public class Ordering {

    public static final String DESC = "DESC";
    public static final String ASC = "ASC";

    private String m_mode;
    private String m_attribute;

    public String getMode() {
        return m_mode;
    }

    public void setMode(String mode) {
        m_mode = mode;
    }

    public String getAttribute() {
        return m_attribute;
    }

    public void setAttribute(String attribute) {
        m_attribute = attribute;
    }

}
