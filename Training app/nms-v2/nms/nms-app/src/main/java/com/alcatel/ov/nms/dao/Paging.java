package com.alcatel.ov.nms.dao;

public class Paging {

    private Integer m_startIndex;
    private Integer m_numberOfRecords;

    public Integer getStartIndex() {
        return m_startIndex;
    }

    public void setStartIndex(Integer startIndex) {
        this.m_startIndex = startIndex;
    }

    public Integer getNumberOfRecords() {
        return m_numberOfRecords;
    }

    public void setNumberOfRecords(Integer numberOfRecords) {
        this.m_numberOfRecords = numberOfRecords;
    }

}
