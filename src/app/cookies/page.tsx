
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <Cookie className="h-8 w-8 text-primary" />
            Cookie Policy (UK)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
          This Cookie Policy was last updated on June 18, 2025 and applies to citizens and legal permanent residents of the United Kingdom.
          <br />
            1. Introduction
            <br />  Our website, https://getthatcruise.co.uk (hereinafter: “the website”) uses cookies and other related technologies (for convenience all technologies are referred to as “cookies”). Cookies are also placed by third parties we have engaged. In the document below we inform you about the use of cookies on our website.

            <br />2. What are cookies?
            <br />A cookie is a small simple file that is sent along with pages of this website and stored by your browser on the hard drive of your computer or another device. The information stored therein may be returned to our servers or to the servers of the relevant third parties during a subsequent visit.
            <br />
            3. What are scripts?
            <br />A script is a piece of program code that is used to make our website function properly and interactively. This code is executed on our server or on your device.
            <br />
            4. What is a web beacon?
            <br />A web beacon (or a pixel tag) is a small, invisible piece of text or image on a website that is used to monitor traffic on a website. In order to do this, various data about you is stored using web beacons.
            <br />
            5. Cookies
            <br />5.1 Technical or functional cookies
            <br />
            Some cookies ensure that certain parts of the website work properly and that your user preferences remain known. By placing functional cookies, we make it easier for you to visit our website. This way, you do not need to repeatedly enter the same information when visiting our website and, for example, the items remain in your shopping cart until you have paid. We may place these cookies without your consent.
            <br />
            5.2 Statistics cookies
            <br />
            We use statistics cookies to optimize the website experience for our users. With these statistics cookies we get insights in the usage of our website. We ask your permission to place statistics cookies.
            <br />
            5.3 Advertising cookies
            <br />
            On this website we use advertising cookies, enabling us to gain insights into the campaign results. This happens based on a profile we create based on your behaviour on https://needthatcruise.co.uk. With these cookies you, as website visitor, are linked to a unique ID but these cookies will not profile your behaviour and interests to serve personalized ads.
            <br />
            Because these cookies are marked as tracking cookies, we ask your permission to place these.
            <br />
            5.4 Marketing/Tracking cookies
            <br />
            Marketing/Tracking cookies are cookies or any other form of local storage, used to create user profiles to display advertising or to track the user on this website or across several websites for similar marketing purposes.
            <br />
            5.5 Social media
            <br />
            On our website, we have included content from Facebook to promote web pages (e.g. “like”, “pin”) or share (e.g. “tweet”) on social networks like Facebook. This content is embedded with code derived from Facebook and places cookies. This content might store and process certain information for personalized advertising.
            <br />
            Facebook are located in the United States.
            <br />
            6. Placed cookies<br />
            We only use Google Analytics cookies for traffic purposes.

            7. Consent<br />
            When you visit our website for the first time, we will show you a pop-up with an explanation about cookies. As soon as you click on “Save preferences”, you consent to us using the categories of cookies and plug-ins you selected in the pop-up, as described in this Cookie Policy. You can disable the use of cookies via your browser, but please note that our website may no longer work properly.<br />

            8. Enabling/disabling and deleting cookies<br />
            You can use your internet browser to automatically or manually delete cookies. You can also specify that certain cookies may not be placed. Another option is to change the settings of your internet browser so that you receive a message each time a cookie is placed. For more information about these options, please refer to the instructions in the Help section of your browser.
            <br />
            Please note that our website may not work properly if all cookies are disabled. If you do delete the cookies in your browser, they will be placed again after your consent when you visit our website again.<br />

            9. Your rights with respect to personal data<br />
            You have the following rights with respect to your personal data:
            <br />You have the right to know why your personal data is needed, what will happen to it, and how long it will be retained for.
            <br />Right of access: You have the right to access your personal data that is known to us.
            <br />Right to rectification: you have the right to supplement, correct, have deleted or blocked your personal data whenever you wish.
            <br />If you give us your consent to process your data, you have the right to revoke that consent and to have your personal data deleted.
            <br />Right to transfer your data: you have the right to request all your personal data from the controller and transfer it in its entirety to another controller.
            <br />Right to object: you may object to the processing of your data. We comply with this, unless there are justified grounds for processing.
            <br />To exercise these rights, please contact us. Please refer to the contact details at the bottom of this Cookie Policy. If you have a complaint about how we handle your data, we would like to hear from you, but you also have the right to submit a complaint to the supervisory authority (the Information Commissioner’s Office (ICO)).
            <br />
            10. Contact details
            <br />For questions and/or comments about our Cookie Policy and this statement, please contact us by emailing admin@getthatcruise.co.uk
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
