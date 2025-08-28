export enum NotificationType {
  SUCCESS = 'green',
  ERROR = 'red',
  INFO = 'blue',
  WARNING = 'yellow',
}

export class NotificationService {
  static notificationKey = 'notification'

  static success(message: string, title?: string) {
    return {
      type: NotificationType.SUCCESS,
      title,
      message,
    }
  }

  static error(message: string, title?: string) {
    return {
      type: NotificationType.ERROR,
      title,
      message,
    }
  }
}
