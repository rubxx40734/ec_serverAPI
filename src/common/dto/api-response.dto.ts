export class ApiresponseDto<T> {
  status: boolean;
  message: string;
  data: T;
}
