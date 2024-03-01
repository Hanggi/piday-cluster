import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";

export default function PrivacyPolicy() {
  return (
    <div className="container py-8">
      <Typography level="h1">PiDay Privacy Policy</Typography>
      <Typography level="h2">Introduction</Typography>
      <Typography>
        PiDay (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the
        PiDay platform, a virtual real estate trading platform on the Pi
        Network. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you visit our website, use our mobile
        application, or engage with our services (collectively, the
        &quot;Services&quot;). Please read this privacy policy carefully. If you
        do not agree with the terms of this privacy policy, please do not access
        the Services.
      </Typography>
      <Typography level="h2">Information Collection</Typography>
      <Typography>
        We collect information that you provide directly to us when you register
        on the Services, make a transaction, fill out a form, or communicate
        with us. This information may include, but is not limited to, your name,
        email address, phone number, and payment information.
      </Typography>
      We also automatically collect certain information when you use our
      Services, such as IP addresses, browser type, internet service provider
      (ISP), referring/exit pages, operating system, date/time stamp, and/or
      clickstream data.
      <Typography level="h2">Use of Information</Typography>
      <Typography>
        The information we collect may be used in the following ways:
      </Typography>
      <List>
        <ListItem>To provide and maintain our Services</ListItem>
        <ListItem>To improve user experience</ListItem>
        <ListItem>
          To communicate with you about your account or transactions
        </ListItem>
        <ListItem>To provide customer support</ListItem>
        <ListItem>To perform analytics and conduct customer research</ListItem>
        <ListItem>To comply with legal obligations</ListItem>
        <ListItem>To detect, prevent, and address technical issues</ListItem>
      </List>
      <Typography level="h2">Sharing of Information</Typography>
      <Typography>
        We may share information we have collected about you in certain
        situations. Your information may be disclosed as follows:
      </Typography>
      <List>
        <ListItem>To our subsidiaries and affiliates.</ListItem>
        <ListItem>
          To contractors, service providers, and other third parties we use to
          support our business.
        </ListItem>
        <ListItem>To fulfill the purpose for which you provide it.</ListItem>
        <ListItem>
          For any other purpose disclosed by us when you provide the
          information.
        </ListItem>
        <ListItem>With your consent.</ListItem>
      </List>
      <Typography></Typography>
      <Typography>
        We may also share your information to comply with any court order, law,
        or legal process, including to respond to any government or regulatory
        request.
      </Typography>
      <Typography level="h2">Security of Your Information</Typography>
      <Typography>
        We use administrative, technical, and physical security measures to help
        protect your personal information. While we have taken reasonable steps
        to secure the personal information you provide to us, please be aware
        that despite our efforts, no security measures are perfect or
        impenetrable, and no method of data transmission can be guaranteed
        against any interception or other type of misuse.
      </Typography>
      <Typography level="h2">Changes to This Privacy Policy</Typography>
      <Typography>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page. You are
        advised to review this Privacy Policy periodically for any changes.
      </Typography>
    </div>
  );
}
