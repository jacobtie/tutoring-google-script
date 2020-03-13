interface EventDetails {
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  attendee: string;
}

const labelText = 'Unprocessed Appt';

function main() {
  createCalendarEventFromApptEmails();
}

function createCalendarEventFromApptEmails(): void {
  const [threads, label] = getNewApptThreads();
  const messages = getMessageFromThreads(threads);
  createEventsFromMessages(messages);
  for (let i = 0; i < threads.length; i++) {
    threads[i].removeLabel(label);
  }
}

function getNewApptThreads(): [
  GoogleAppsScript.Gmail.GmailThread[],
  GoogleAppsScript.Gmail.GmailLabel,
] {
  const label = GmailApp.getUserLabelByName(labelText);
  const threads = label.getThreads();

  return [threads, label];
}

function getMessageFromThreads(
  threads: GoogleAppsScript.Gmail.GmailThread[],
): GoogleAppsScript.Gmail.GmailMessage[] {
  const messages: GoogleAppsScript.Gmail.GmailMessage[] = [];
  for (let i = 0; i < threads.length; i++) {
    messages.push(threads[i].getMessages()[0]);
  }

  return messages;
}

function createEventsFromMessages(messages: GoogleAppsScript.Gmail.GmailMessage[]): void {
  for (let i = 0; i < messages.length; i++) {
    createEventFromMessage(messages[i]);
  }
}

function createEventFromMessage(message: GoogleAppsScript.Gmail.GmailMessage): void {
  const details = getEventDetailsFromMessage(message);
  const event: GoogleAppsScript.Calendar.Schema.Event = {
    summary: details.title,
    description: details.description,
    start: { dateTime: details.startTime.toISOString() },
    end: { dateTime: details.endTime.toISOString() },
    attendees: [{ email: details.attendee }],
    conferenceData: {
      createRequest: {
        conferenceSolutionKey: { type: 'hangoutsMeet' },
        requestId: '7896542857',
      },
    },
  };

  Calendar.Events.insert(event, 'primary', { conferenceDataVersion: 1, sendNotifications: true });
}

function getEventDetailsFromMessage(message: GoogleAppsScript.Gmail.GmailMessage): EventDetails {
  const sender = message.getFrom();
  const email = sender.substring(sender.indexOf('<') + 1, sender.length - 1);
  const firstName = sender.substring(0, sender.indexOf(' '));
  const title = `Tutoring Appt w/ Jacob and ${firstName}`;
  const [startTime, endTime] = getDateTimesFromBody(message.getBody());
  const comments = getCommentsFromBody(message.getBody());

  return {
    title,
    startTime,
    endTime,
    description: comments,
    attendee: email,
  };
}

function getDateTimesFromBody(body: string): [Date, Date] {
  const dateIndex = body.indexOf('<b>Date of Appointment</b>');
  const dateStarting = body.substring(dateIndex);
  const nextStartPTag = dateStarting.indexOf('<p>') + 3;
  const nextEndPTag = dateStarting.indexOf('</p>');
  const dateString = dateStarting.substring(nextStartPTag, nextEndPTag).trim();
  const spaceIndex = dateString.indexOf(' ');
  const justDate = dateString.substring(0, spaceIndex);
  const dashIndex = dateString.indexOf('-');
  const startTime = dateString.substring(spaceIndex + 1, dashIndex);
  const endTime = dateString.substring(dashIndex + 1);

  const startTimeFixed =
    startTime.substring(0, startTime.length - 1) +
    ':' +
    startTime.substring(startTime.length - 1) +
    'm';
  const endTimeFixed =
    endTime.substring(0, endTime.length - 1) + ':' + endTime.substring(endTime.length - 1) + 'm';

  const startDate = new Date(justDate + ' ' + startTimeFixed);
  const endDate = new Date(justDate + ' ' + endTimeFixed);

  return [startDate, endDate];
}

function getCommentsFromBody(body: string): string {
  const commentsIndex = body.indexOf('<b>Comments</b>');
  const commentsStarting = body.substring(commentsIndex);
  const nextStartPTag = commentsStarting.indexOf('<p>') + 3;
  const nextEndPTag = commentsStarting.indexOf('</p>');

  const commentsBeforeP = commentsStarting.substring(nextStartPTag, nextEndPTag);
  const comments = commentsBeforeP.substring(commentsBeforeP.indexOf('<p>') + 3).trim();

  return comments;
}
