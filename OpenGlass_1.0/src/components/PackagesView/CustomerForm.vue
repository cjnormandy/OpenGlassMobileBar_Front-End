<template>
    <div>
      <div class="mt-10 p-3 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="submitForm">
            <div>
                <label for="firstName" >First Name:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="firstName" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" v-model="formData.firstName" required />
                </div>
            </div>
            <div>
                <label for="firstName" >Last Name:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="lastName" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" v-model="formData.lastName" required />
                </div>
            </div>
            <div>
                <label for="email" >Email:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="email" type="email" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" v-model="formData.email" required />
                </div>
            </div>
            <div>
                <label for="address" >Event Address:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="address" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" v-model="formData.address" required />
                </div>
            </div>
            <div>
                <label for="phone" >Phone Number:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="phone" type="tel" pattern="[0-9]{10}" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" v-model="formData.phone" required />
                </div>
            </div>
            <div>
                <label for="date" >Date:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="date" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" type="date" v-model="formData.date" required />
                </div>
            </div>
            <div>
                <label for="date" >Date of Birth:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="dob" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" type="date" v-model="formData.dob" required  />
                </div>
            </div>
            <div>
                <label for="signature" >Signature:</label>
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input id="signature" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" type="text" @change="onSignatureChange" required />
                </div>
            </div>
            <div class="pt-2">
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <label for="signature" >  </label>
                    <button type="submit" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">Save PDF</button>
                </div>
            </div>
        </form>
      </div>
      
    </div>
  </template>
    
  <script>
  import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
  import fontkit from '@pdf-lib/fontkit';

  import { usePaymentStore } from '../../store/payments';

  export default {
    props: {selectedDate: null, amt: null, serv_id: null},
    data() {
      return {
        formData: {
          firstName: '',
          lastName: '',
          date: '',
          address: '',
          dob: '',
          phone: '',
          email: '',
          signature: null
        }
      };
    },
    methods: {
      submitForm() {
        this.modifyPDF();
        this.addNewPayment();
      },
      onSignatureChange(e) {
        const signatureText = e.target.value;
        this.formData.signature = signatureText;
      },
      setMinDate() {
        var dobInput = document.getElementById("dob");
        var today = new Date();
        today.setFullYear(today.getFullYear() - 21); // Set the year to 21 years ago

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        var yyyy = today.getFullYear();

        // Set max date as 21 years ago from today
        dobInput.setAttribute("max", yyyy + '-' + mm + '-' + dd);
      },
      addNewPayment() {
        const paymentData = {
          first_name: this.formData.firstName,
          last_name: this.formData.lastName,
          birthday: this.formData.dob,
          phone: this.formData.phone,
          email: this.formData.email
        }
        const tranactionData = {
          service_id: this.serv_id,
          payment_type: "Stripe"
        }
        const paymentStore = usePaymentStore();
        paymentStore.addCustomer(paymentData, tranactionData);
      },
      async modifyPDF() {
        const pdfDoc = await PDFDocument.create()
        pdfDoc.registerFontkit(fontkit);
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()
        const fontSize = 30
        const textWidth = timesRomanFont.widthOfTextAtSize('Client Service Agreement', fontSize);
        const textX = (width - textWidth) / 2;
        page.drawText('Client Service Agreement', {
          x: textX,
          y: height - 1 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
  
        let yOffset = height - 1 * fontSize; 
        const headerFontSize = 16;
  
        // Function to add multiline text
        function addMultilineText(page, textLines, xOffset, yOffset, lineSpacing) {
          textLines.forEach(line => {
            page.drawText(line, {
              x: xOffset,
              y: yOffset,
              size: 12,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
            yOffset -= lineSpacing;
          });
          return yOffset;
        }
  
        function addHeader(page, headerText, xOffset, yOffset) {
          const textX = 50;
  
          page.drawText(headerText, {
            x: textX,
            y: yOffset,
            size: headerFontSize,
            font: timesRomanFont,
            color: rgb(0.1, 0.1, 0.1),
          });
  
          return yOffset - (headerFontSize + 10);
        }
  
        // This section should replace the incorrect page.setText
        const introTxtLines = [
          `This bartending mobile services contract is between Open Glass Mobile Bar, LLC and`,
          `${this.formData.firstName} ${this.formData.lastName}. Both parties are in agreement to the following for the`,
          `event taking place on ${this.selectedDate}.`
        ];
        
        addMultilineText(page, introTxtLines, 50, yOffset - 30, 18);
  
        yOffset -= 100;
  
        addHeader(page, "Description of Services", 50, yOffset);
  
        const descripTxtLines = [
          `On ${this.formData.date} at ${this.formData.address}, ${this.formData.firstName} will provide to ${this.formData.lastName} the following`,
          `bartending services:`
        ];
        
        addMultilineText(page, descripTxtLines, 50, yOffset - 30, 18);
  
        yOffset -= 80;
  
        addHeader(page, "-----------", 50, yOffset);
  
        const descripTxtLines2 = [
          `Open Glass Mobile Bar, LLC bartenders will work a total of 3 hours on ${this.selectedDate}.`
        ];
  
        addMultilineText(page, descripTxtLines2, 50, yOffset - 30, 18);
  
        yOffset -= 80;
  
        addHeader(page, "Payment", 50, yOffset)
  
        const paymentTxtLines = [
          `Open Glass Mobile Bar, LLC will receive a 30% deposit of the full amount of \$${this.amt} to`,
          `secure services for this event, due upon signature of this agreement. It may not be possible to`,
          `provide additional service time, request for extended service time may be accommodated only if`,
          `feasible and at discretion of the bartender. The remaining payment balance will be automatically`,
          `deducted from the initial deposit payment method, typically 14 days before the event. Any`,
          `remaining balance will be due as shown in the table below.`
        ]
        addMultilineText(page, paymentTxtLines, 50, yOffset - 30, 18)
  
        yOffset -= 130;
  
        const paymentTxtLines2 = [
          `If client fails to pay for the services due to insufficient funds when due, Open Glass Mobile Bar,`,
          `LLC have the option to treat such failure to pay as a material breach for this Agreement. In such`,
          `case, the service provider may opt to terminate the Agreement without refunds and pursue any`,
          `and all legal remedies at their disposal.`
        ]
        addMultilineText(page, paymentTxtLines2, 50, yOffset - 30, 18)
  
        yOffset -= 140;
  
        addHeader(page, "Cancellation & Rescheduling Policy", 50, yOffset)
        
        const cancelTxtLines = [
          `Full payment is required 14 days before the event. Once the full payment is submitted, it is non-`,
          `refundable. Should the Client choose to cancel the event before the`,
          `services, ${this.formData.firstName} ${this.formData.lastName} will provide Open Glass Mobile Bar, LLC with`,
          `notice no later than 14 days before ${this.selectedDate}. Cancellation past this date will result in not`,
          `receiving the full amount of \$${this.amt} paid to secure the service of the event.`,
          `remaining balance will be due as shown in the table below.`
        ]
        addMultilineText(page, cancelTxtLines, 50, yOffset - 30, 18)
  
        yOffset -= 150;
  
        const cancelTxtLines2 = [
          `Cancellation issued by Open Glass Mobile Bar, LLC shall result in full reimbursement of`,
          `payments paid to the client.`,
          `However, if the client decides to postpone the event after full payment is processed, they have`,
          `the option to reschedule the event for another available date, by informing us at least 72 hours`,
          `before the original scheduled event date.`
        ]
        addMultilineText(page, cancelTxtLines2, 50, yOffset - 30, 18)
  
        // After adding the second page
        const page2 = pdfDoc.addPage()
        const { width: width2, height: height2 } = page2.getSize()
  
        let yOffset2 = height2 - 1 * fontSize;
  
        
  
        yOffset2 -= (1 * fontSize) + 20;
  

        const additionalTermsHeader = 'Additional Terms';
  
        page2.drawText(additionalTermsHeader, {
          x: 50,
          y: yOffset2,
          size: 20,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
  
        yOffset2 -= 20;
  
        // Now let's add the additional terms text
        const additionalTermsLines = [
          `• Open Glass Mobile Bar, LLC will be solely responsible for the acquisition of all licenses and`,
          `    permits required to provide bartending services for ${this.selectedDate}.`,
          `• Open Glass Mobile Bar, LLC will be solely responsible for the acquisition any and all licenses`,
          `    and permits needed and will be responsible for providing all drinks offered in this bartender contract.`,
          `• Open Glass Mobile Bar, LLC bartender will be permitted to display a tip jar'/container.`,
          `• Open Glass Mobile Bar, LLC will be responsible for all set up and take down of the service area.`,
          `• Open Glass Mobile Bar, LLC will be responsible for ensuring that no underage patrons`,
          `    purchase or consume alcohol from the bar. Guests that are asked to present an ID and cannot,`,
          `    will not be served. The bartender will only sell/serve to those legally permitted to drink in Texas.`,
          `• The bartender will also use his'/her discretion to cease serving patrons who are visibly intoxicated,`,
          `    behaving inappropriately, or who may pose a risk to themselves or others.`,
          `    Open Glass Mobile Bar, LLC is not responsible for any individual who may`,
          `    become intoxicated or for any damages that may be caused by an intoxicated guest.`,
          `    The event host is liable for any and all alcohol-related injuries or accidents`,
          `    during or following the event.`,
          `• Open Glass Mobile Bar, LLC bartenders will not be held responsible for damages to equipment`,
          `    or products during the normal course of the event.`,
          `• Open Glass Mobile Bar, LLC will be responsible for providing all drinkware`,
          `    and equipment needed for the event to maintain service and the guests' overall satisfaction.`,
          `• Guests are not permitted to serve their own alcohol`,
          `• All alcohol must be opened, poured, served & under the supervision of`,
          `     Open Glass Mobile Bar, LLC licensed and insured bartenders. (This includes canned & bottled beer)`,
          `• Open Glass Mobile Bar, LLC bartenders will not serve any alcohol to anyone`,
          `    until the agreed bar opening time.`,
          `• Any liquor brought to the bar will be kept behind the bar, under bartender’s supervision.`,
          `   No one may take any liquor bottles from the bar for any reason.`,
          `   When Open Glass Mobile Bar, LLC arrives at the property of your event,`,
          `   our liquor liability insurance coverage begins immediately. Because of this,`,
          `   once we arrive on site, no one will be allowed to take any alcohol whatsoever `,
          `   away from the bar to their car or private room for any reason.  `,
          `   This also applies to personal bottles of liquor that are not planned to be served`,
          `   to any of the guests during the event but are on the premises already from prior day`,
          `   drinking or safe keeping for a friend or a guest.`,
          `• If anyone serves themselves or others against the will of the bartenders,`,
          `    Open Glass Mobile Bar, LLC liquor liability insurance will be void.`,
          `• All bottles of beer, champagne, wine, and liquor provided by the hosts will be opened`,
          `    and served at Bartending discretion. Instructions to reserve a certain alcoholic beverage`,
          `    or specific bottle for any special reason or person should be noted here before signing.`
        ];
  
        additionalTermsLines.forEach(line => {
          page2.drawText(line.trim(), {
            x: 50,
            y: yOffset2,
            size: 12,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
  
          yOffset2 -= 18;
        });
  
        if (this.formData.signature) {
          const fontBytes = await fetch('/CedarvilleCursive-Regular.ttf').then(res => res.arrayBuffer());
          const cursiveFont = await pdfDoc.embedFont(fontBytes);
  
          const signatureX = 50;
          const signatureY = 5;
          const fontSize = 24;


          page2.drawText(this.formData.signature, {
            x: signatureX,
            y: signatureY,
            font: cursiveFont,
            size: fontSize
          });
        }

        const pdfBytes = await pdfDoc.save();
  
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'modified_service_agreement.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
      }
    },
    mounted() {
      this.setMinDate();
    }
  };
  </script>