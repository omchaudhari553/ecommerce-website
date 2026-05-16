package com.springboot.dto;

public class PaymentResponse {
    private String razorpayOrderId;
    private String amount;
    private String key;
    private String currency;
    private String description;

    public PaymentResponse() {
    }

    public PaymentResponse(String razorpayOrderId, String amount, String key, String currency, String description) {
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.key = key;
        this.currency = currency;
        this.description = description;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
