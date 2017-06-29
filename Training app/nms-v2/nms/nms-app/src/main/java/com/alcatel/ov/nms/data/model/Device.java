package com.alcatel.ov.nms.data.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;

@Document(collection = "Device")
public class Device implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;
    private Status status;
    private List<Attribute> attributes = new ArrayList<Attribute>();
    private List<AbstractObject> subs = new ArrayList<AbstractObject>();
    private List<Alarm> alarms = new ArrayList<Alarm>();
    private TypeObject type;
    private Boolean isRoot;

    public Device() {

    }

    public Device(String id, String name, TypeObject type, Status status) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.type = type;
    }

    public Device(String name, Status status, List<Attribute> attributes, List<AbstractObject> subs, List<Alarm> alarms, TypeObject type,
            Boolean isRoot) {
        this.name = name;
        this.status = status;
        this.attributes = attributes;
        this.subs = subs;
        this.alarms = alarms;
        this.type = type;
        this.isRoot = isRoot;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public List<Attribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }

    public void addAttribute(Attribute attribute) {
        this.attributes.add(attribute);
    }

    public List<AbstractObject> getSubs() {
        return subs;
    }

    public void setSubs(List<AbstractObject> subs) {
        this.subs = subs;
    }

    public void addSub(AbstractObject sub) {
        this.subs.add(sub);
    }

    public List<Alarm> getAlarms() {
        return alarms;
    }

    public void setAlarms(List<Alarm> alarms) {
        this.alarms = alarms;
    }

    public void addAlarm(Alarm alarm) {
        this.alarms.add(alarm);
    }

    public TypeObject getType() {
        return type;
    }

    public void setType(TypeObject type) {
        this.type = type;
    }

    public Boolean getIsRoot() {
        return isRoot;
    }

    public void setIsRoot(Boolean isRoot) {
        this.isRoot = isRoot;
    }

}
