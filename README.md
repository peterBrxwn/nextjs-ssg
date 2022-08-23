## FULL STACK ASSIGNMENT
## Goal

Goal of this assignment is to get insights about how you would approach to every-day development duties.

## Timeline

There is no time limit on the assignment, feel free to spend on the assignment as long as you want. But please indicate how much you spent after your submission.

## Tech

You have been requested to build an application using low-code to no-code approaches. This doesn’t mean you shouldn’t write code, coding is expected but the solution must rely on third party services as much as possible.

Feel free to choose any framework/tool you want at any of the stages. We would also like to assess how you approach to decision making.  

## Task

Mora Medical has noticed that there are a lot of misinformation about “What healthy food is” and “How a healthy diet should be prepared”. To inform the public about healthy nutrition and to map out people’s eating habits, Mora has decided to launch public health days this summer.

**Features**

- As a user I can sign in using social providers
- As an administrator I can create public events, events consisting of a start date, title, description, host doctors’ name and duration.
- As a user I can subscribe to events. I can also, unsubscribe from events.
- As a user I cannot subscribe to events that have a conflict with my agenda.
- Once approaching event’s date, I receive a email & SMS message to remember me about the event.
- As an administrator I can cancel any attendee, which will trigger a notification to the user.
- At the end of month, stream all events data (attendees, host etc.) to a dedicated db.

**Implementation Details**

- Consider to generate static htmls for every event using [SSG](https://dev.to/heymich/client-side-rendering-server-side-rendering-and-ssg-in-plain-english-5h3b#:~:text=Static%2Dsite%20Generation%20(SSG),run%2Dtime%20or%20request%20time.)
    - Bonus point: Aim for a high Google LightHouse score
    

## ANSWER

Hello!,

I am done with the project.

link: nextjs-ssr-six.vercel.app
Admin Login:
Email: admin@mora.com
Pass: moramora
User Login:
Email: user@mora.com
Pass: moramora

Admin can create events and users can subscribe to and unsubscribe from the events.
A user is not allowed to subscribe for overlapping events.
Admins can cancel any user's subscription.

For new users using social logins, an ADMIN account would be automatically created for them.

SSG: nextjs-ssr-six.vercel.app/events
The list of events are generated at build time and statically hosted there.

Tech Stack: NextJs (ReactJs, HTML, CSS, Bootstrap), Javascript, Firebase, Cloud functions, Cloud Firestore.
Third Party services utilized: Firebase, Vercel.

If you send me your email, I can forward the Admin and user notifications (Deadline and subscription cancellation by admin) to your device.
All events are presently stored in cloud firestore. I can push it to any dedicated db of your choosing every month end. All I need is an api.

If I had access to the clients using this app, I would try to find out more on how the would be using the app. With this, I can optimize the site for their use.

Time Spent: ~ 15 hrs (2 days)

[TEST] If a user is subscribed to "Overlap 1", he should not be able to subscribe to "Overlap 2/3/4".
