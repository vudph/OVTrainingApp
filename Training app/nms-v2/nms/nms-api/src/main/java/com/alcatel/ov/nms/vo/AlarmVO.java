package com.alcatel.ov.nms.vo;

public class AlarmVO {

    private String m_id;

    private String m_name;

    private String m_source;

    private String m_severity;

    public AlarmVO() {

    }

    public AlarmVO(String id, String name, String source, String severity) {
        super();
        this.m_id = id;
        this.m_name = name;
        this.m_source = source;
        this.m_severity = severity;
    }

    /**
     * @return the m_id
     */
    public String getId() {
        return m_id;
    }

    /**
     * @param m_id
     *            the id to set
     */
    public void setId(String id) {
        this.m_id = id;
    }

    /**
     * @return the m_device
     */
    public String getName() {
        return m_name;
    }

    /**
     * @param name
     *            the m_device to set
     */
    public void setName(String name) {
        this.m_name = name;
    }

    /**
     * @return the m_port
     */
    public String getSource() {
        return m_source;
    }

    /**
     * @param source
     *            the m_port to set
     */
    public void setSource(String source) {
        this.m_source = source;
    }

    /**
     * @return the m_severity
     */
    public String getSeverity() {
        return m_severity;
    }

    /**
     * @param severity
     *            the m_severity to set
     */
    public void setSeverity(String severity) {
        this.m_severity = severity;
    }

}
