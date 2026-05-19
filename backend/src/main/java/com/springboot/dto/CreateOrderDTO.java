package com.springboot.dto;

import java.util.List;

public class CreateOrderDTO {
    private List<OrderItemDTO> orderItems;
    private String shippingAddress;
    private String userEmail;

    public CreateOrderDTO() {
    }

    public CreateOrderDTO(List<OrderItemDTO> orderItems, String shippingAddress, String userEmail) {
        this.orderItems = orderItems;
        this.shippingAddress = shippingAddress;
        this.userEmail = userEmail;
    }

    public List<OrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
