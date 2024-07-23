export interface Agency {
  _id: string;
  routeNo: string;
  description: string;
  person: string;
  serviceReportNo: string[];
  agencyNo: string;
  createdAt: Date;
  updatedAt: Date;
  lastCalibrationDates: Date[];
}
