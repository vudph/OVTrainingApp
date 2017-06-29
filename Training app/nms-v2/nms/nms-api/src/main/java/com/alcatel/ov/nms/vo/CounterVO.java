package com.alcatel.ov.nms.vo;

public class CounterVO {
    private Long m_count;

    private String m_name;

    public CounterVO() {
    }

    public CounterVO(Long count, String name) {
        super();
        this.m_count = count;
        this.m_name = name;
    }

    public Long getCount() {
        return m_count;
    }

    public void setCount(Long count) {
        m_count = count;
    }

    public String getName() {
        return m_name;
    }

    public void setName(String name) {
        m_name = name;
    }
}
