package com.alcatel.ov.nms.data.model;

import java.io.Serializable;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import com.alcatel.ov.nms.data.constant.AlarmSeverity;

@Document(collection = "Alarm")
public class Alarm implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;
    private String name;
    private String source;
    private AlarmSeverity severity;

    public Alarm() {

    }

    public Alarm(String name, String source, AlarmSeverity severity) {
        this.name = name;
        this.source = source;
        this.severity = severity;
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

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public AlarmSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlarmSeverity severity) {
        this.severity = severity;
    }

}
