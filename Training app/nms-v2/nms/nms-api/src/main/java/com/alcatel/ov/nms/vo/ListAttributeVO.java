package com.alcatel.ov.nms.vo;

import java.util.ArrayList;
import java.util.Collection;

@SuppressWarnings("serial")
public class ListAttributeVO extends ArrayList<AttributeVO> {

    public ListAttributeVO() {
        super();
    }

    public ListAttributeVO(Collection<? extends AttributeVO> c) {
        super(c);
    }

    public ListAttributeVO(int initialCapacity) {
        super(initialCapacity);
    }

}
