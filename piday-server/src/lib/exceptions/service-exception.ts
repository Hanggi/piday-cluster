export class ServiceException extends Error {
  constructor(
    public message: string,
    public code: string,
  ) {
    super(message);
  }
}
