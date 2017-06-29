package com.alcatel.ov.nms.data.model;

import com.alcatel.ov.nms.data.constant.AttributeGroup;

public class Attribute {

    private String name;
    private String dataType;
    private String value;
    private Boolean isReadable;
    private Boolean isWritable;
    private AttributeGroup attributeGroup;

    public Attribute() {

    }

    public Attribute(String name, String dataType, String value, Boolean isReadable, Boolean isWritable, AttributeGroup attributeGroup) {
        this.name = name;
        this.dataType = dataType;
        this.value = value;
        this.isReadable = isReadable;
        this.isWritable = isWritable;
        this.attributeGroup = attributeGroup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Boolean getIsReadable() {
        return isReadable;
    }

    public void setIsReadable(Boolean isReadable) {
        this.isReadable = isReadable;
    }

    public Boolean getIsWritable() {
        return isWritable;
    }

    public void setIsWritable(Boolean isWriteable) {
        this.isWritable = isWriteable;
    }

    public AttributeGroup getAttributeGroup() {
        return attributeGroup;
    }

    public void setAttributeGroup(AttributeGroup attributeGroup) {
        this.attributeGroup = attributeGroup;
    }

}
