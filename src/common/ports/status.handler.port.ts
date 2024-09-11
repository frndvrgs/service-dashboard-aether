export interface StatusServicePort<HttpStatusInput, HttpStatusOutput> {
  createHttpStatus(status?: HttpStatusInput): HttpStatusOutput;
}
