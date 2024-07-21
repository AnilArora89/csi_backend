export interface Agency {
  _id: string;
  routeNo: string;
  description: string;
  person: string;
  serviceReportNo: String[];
  agencyNo: string;
  createdAt: Date;
  updatedAt: Date;
  lastCalibrationDates: Date[];
}
