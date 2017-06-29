package com.alcatel.ov.nms.vo;

import java.io.Serializable;
import java.util.List;

public class AttributeVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String m_name;

    private String m_value;

    private String m_dataType;

    private String m_groupName;

    private Boolean m_readable;

    private Boolean m_writable;

    private List<String> m_validValues;

    private String m_regex;

    public AttributeVO() {
        // TODO Auto-generated constructor stub
    }

    public AttributeVO(String name, String value, String dataType, String groupName, Boolean readable, Boolean writable,
            List<String> validValues, String regex) {
        super();
        this.m_name = name;
        this.m_value = value;
        this.m_dataType = dataType;
        this.m_groupName = groupName;
        this.m_readable = readable;
        this.m_writable = writable;
        this.m_validValues = validValues;
        this.m_regex = regex;
    }

    /**
     * @return the goupName
     */
    public String getGroupName() {
        return m_groupName;
    }

    /**
     * @param groupName
     *            the goupName to set
     */
    public void setGroupName(String groupName) {
        m_groupName = groupName;
    }

    /**
     * @return the name
     */
    public String getName() {
        return m_name;
    }

    /**
     * @param name
     *            the name to set
     */
    public void setName(String name) {
        m_name = name;
    }

    /**
     * @return the value
     */
    public String getValue() {
        return m_value;
    }

    /**
     * @param value
     *            the value to set
     */
    public void setValue(String value) {
        m_value = value;
    }

    /**
     * @return the m_editable
     */
    public Boolean getReadable() {
        return m_readable;
    }

    /**
     * @param editable
     *            the m_editable to set
     */
    public void setReadable(Boolean readable) {
        this.m_readable = readable;
    }

    /**
     * @return the m_writable
     */
    public Boolean getWritable() {
        return m_writable;
    }

    /**
     * @param writable
     *            the m_writable to set
     */
    public void setWritable(Boolean writable) {
        this.m_writable = writable;
    }

    /**
     * @return the m_dataType
     */
    public String getDataType() {
        return m_dataType;
    }

    /**
     * @param dataType
     *            the m_dataType to set
     */
    public void setDataType(String dataType) {
        this.m_dataType = dataType;
    }

    /**
     * @return the m_validValues
     */
    public List<String> getValidValues() {
        return m_validValues;
    }

    /**
     * @param validValues
     *            the m_validValues to set
     */
    public void setValidValues(List<String> validValues) {
        this.m_validValues = validValues;
    }

    /**
     * @return the m_regex
     */
    public String getRegex() {
        return m_regex;
    }

    /**
     * @param regex
     *            the m_regex to set
     */
    public void setRegex(String regex) {
        this.m_regex = regex;
    }

}
