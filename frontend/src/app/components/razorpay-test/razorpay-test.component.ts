import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Razorpay: any;

@Component({
  selector: 'app-razorpay-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; text-align: center;">
      <h2>Razorpay Test</h2>
      <button (click)="testRazorpay()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Test Razorpay Payment
      </button>
      <div *ngIf="message" style="margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
        {{message}}
      </div>
    </div>
  `
})
export class RazorpayTestComponent {
  message: string = '';

  testRazorpay(): void {
    this.message = 'Testing Razorpay...';
    
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
      this.message = 'Error: Razorpay is not loaded!';
      return;
    }

    console.log('Razorpay is loaded:', Razorpay);
    
    const options = {
      key: 'rzp_test_SJVh94ayqM9QeO',
      amount: '73800', // ₹738 in paise
      currency: 'INR',
      name: 'Test Payment',
      description: 'Test Description',
      order_id: 'order_SN2wYmpUFtTPNl', // Use existing order ID
      handler: (response: any) => {
        console.log('Payment success:', response);
        this.message = 'Payment successful! Payment ID: ' + response.razorpay_payment_id;
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
          this.message = 'Payment modal was dismissed';
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      console.log('Razorpay instance created:', rzp);
      rzp.open();
      this.message = 'Razorpay popup opened! Check for popup.';
    } catch (error: any) {
      console.error('Error opening Razorpay:', error);
      this.message = 'Error opening Razorpay: ' + (error?.message || error?.toString() || 'Unknown error');
    }
  }
}
