package com.alcatel.ov.nms.data.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;

@Document(collection = "Port")
public class Port implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;
    private String name;
    private Status status;
    private List<Attribute> attributes = new ArrayList<Attribute>();
    private List<Alarm> alarms = new ArrayList<Alarm>();
    private TypeObject type;

    public Port() {
        this.type = TypeObject.PORT;
    }

    public Port(String id, String name, TypeObject type, Status status) {
        super();
        this.id = id;
        this.name = name;
        this.status = status;
        this.type = type;
    }

    public Port(String name, Status status, List<Attribute> attributes, List<Alarm> alarms) {
        this.name = name;
        this.status = status;
        this.attributes = attributes;
        this.alarms = alarms;
        this.type = TypeObject.PORT;
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

}
