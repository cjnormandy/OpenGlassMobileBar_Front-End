<template>
  <div>
    <h1 class="text-3xl font-bold"></h1> <!-- No heading text -->
    <div v-for="(item, index) in faqItems" :key="index">
      <div @click="toggleAccordion(index)" class="bg-gray-100 p-4 mt-4 cursor-pointer">
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">{{ item.question }}</div>
          <div v-if="item.open" class="transform rotate-0">
            &#x25B2;
          </div>
          <div v-else class="transform rotate-180">
            &#x25B2;
          </div>
        </div>
        <div v-if="item.open" class="mt-4">
          <p v-html="item.answer"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faqItems: [
        {
          question: "What types of drinks do you offer?",
          answer: "We specialize in crafting distinctive cocktails infused with a hint of Latin-inspired influence. Additionally, we offer a selection of standard beverages like wine and beer, as well as a range of non-alcoholic options such as mocktails.",
          open: false,
        },
        {
          question: "Is a deposit required to secure a booking?",
          answer: "Yes. The deposit required will be 30% of the total amount, depending on the package selected.",
          open: false,
        },
        {
          question: "What happens in the case of an unexpected event cancellation?",
          answer: "You may cancel your reservation for a full refund if it is done within 14 days prior to the event. In case of unforeseen circumstances like a categorical hurricane or tropical storm, we are more than willing to work with you to find an alternative date for your event. <br><br> We understand that Houston weather can be unpredictable. However, please note that we do not permit cancellations solely due to rain. In such a scenario, we will be happy to arrange a complimentary tent to accommodate for the rain, at no extra cost to you.",
          open: false,
        },
        {
          question: "What if I need to reschedule, what is your policy for rescheduling?",
          answer: "We would gladly assist in rescheduling for a future date, provided we receive a minimum of 72 hours' notice before the scheduled event. Please note that in such cases, refunds will not be issued.",
          open: false,
        },
        {
          question: "How early will the mobile bar be set up before the event starts?",
          answer: "Our team will arrive 2 to 3 hours from the selected date and time you booked with us. Additionally, we will contact you one to two days before the event to reconfirm the arrival time.",
          open: false,
        },
        {
          question: "How do you handle underage guests at events?",
          answer: "We are delighted to offer non-alcoholic mocktails for underage guests. Please be aware that we reserve the right to request and verify IDs from any guest at the event.",
          open: false,
        },
        {
          question: "Do you offer non-alcoholic beverages options?",
          answer: "Certainly! While our packages include cocktail options, we are more than willing to tailor them to include mocktail alternatives as well.",
          open: false,
        },
        {
          question: "What is your policy on insurance and liability coverage?",
          answer: "We hold comprehensive liquor liability insurance to safeguard against unforeseen incidents, along with general liability insurance. For further details, feel free to inquire for additional information.",
          open: false,
        },
        {
          question: "What is the staffing ration for bartenders at events?",
          answer: "The cost will vary based on the package you choose, as well as the anticipated number of guests at your event.",
          open: false,
        },
        {
          question: "Can I bring my own alcohol for the event or does the mobile bar provide the alcohol?",
          answer: "As per Texas law, we're unable to supply alcohol without a physical establishment. Therefore, either you or the venue will need to provide the alcohol once you've selected your signature drink from our menu for your package. Additionally, you have the flexibility to choose a specific alcohol brand of your liking for your selected signature drinks.",
          open: false,
        },
        {
          question: "Can I request a specific theme or style for the mobile bar set up?",
          answer: "We are pleased to accommodate any particular theme or style you envision for your special event. Simply get in touch with us, share all the details about your desired theme and style, and we'll gladly furnish you with a customized quote.",
          open: false,
        },
        {
          question: "How far can you travel to provide service?",
          answer: "We are available to serve any surrounding city in the Houston area, including Brookshire, Hockley, Cypress, Katy, Spring, Sugar Land, Pearland, The Woodlands, and more. Just let us know the location of your event, and we will be delighted to travel and cater for you.",
          open: false,
        },
        {
          question: "What type of mixers do your packages include?",
          answer: "To ensure an outstanding experience at your event, we offer a range of mixers including Club soda, Coke, Cranberry Juice, Apple Juice, and more, depending on the signature drinks you choose from our menu for your package. If you have any specific preferences for mixers beyond what we provide, please don't hesitate to inform us. We're happy to accommodate your requests.",
          open: false,
        },
        {
          question: "Will you help me calculate the amount of alcohol I will need for my event?",
          answer: "Absolutely! We dedicate the time to assist you in calculating the appropriate quantity of alcohol required, taking into account the number of guests and their individual drinking preferences. We will provide a shopping list to ensure that you don't end up with excess or insufficient alcohol, allowing you to remain within your intended budget.",
          open: false,
        },
        {
          question: "What does your mobile bar offer?",
          answer: "We come fully prepared with TACB certified professional bartenders, a complete set of bar supplies, napkins, garnishes, mixers, straws, disposable glassware, and handle both set-up and clean-up. Our services also include comprehensive liquor liability insurance, ensuring a worryfree bar experience. We're committed to delivering an outstanding bar service for various special occasions, including corporate events, birthday parties, weddings, and other celebratory gatherings. Additionally, we're happy to accommodate any specific themes, styles, or additional requirements your event may have.",
          open: false,
        },
        {
          question: "How do I get started?",
          answer: "To kick off the process, simply choose a package and secure your event date by booking it on our calendar.<br><br> 1) Choose from our package your preferred package.<br><br> 2) Choose a variety of cocktail/mocktail options.<br><br> 3) You can choose add-ons to upgrade your package.<br><br> 4) Enter your event details and secure your event date and time<br><br> 5) Submit all your items on your cart. You will be required to put down a form of payment at this time.<br><br> <b>Packages do not include alcohol.</b>",
          open: false,
        },
      ],
    };
  },
  methods: {
    toggleAccordion(index) {
      this.faqItems[index].open = !this.faqItems[index].open;
    },
  },
};
</script>