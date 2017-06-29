package com.alcatel.ov.nms.data.model;

import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;

public class AbstractObject {

    private String id;
    private String name;
    private TypeObject type;
    private Status status;

    public AbstractObject() {

    }

    public AbstractObject(String id, String name, TypeObject type, Status status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.setStatus(status);
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

    public TypeObject getType() {
        return type;
    }

    public void setType(TypeObject type) {
        this.type = type;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

}
