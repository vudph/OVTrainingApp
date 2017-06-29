package com.alcatel.ov.nms.vo;

public class NMSObjectVO {

    private String m_id;

    private String m_name;

    private String m_type;

    private String m_status;

    public NMSObjectVO() {
    }

    public NMSObjectVO(String id, String name, String type, String status) {
        super();
        this.m_id = id;
        this.m_name = name;
        this.m_type = type;
        this.m_status = status;
    }

    public String getId() {
        return m_id;
    }

    public void setId(String id) {
        this.m_id = id;
    }

    public String getName() {
        return m_name;
    }

    public void setName(String name) {
        this.m_name = name;
    }

    public String getType() {
        return m_type;
    }

    public void setType(String type) {
        this.m_type = type;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return m_status;
    }

    /**
     * @param status
     *            the status to set
     */
    public void setStatus(String status) {
        m_status = status;
    }

}
