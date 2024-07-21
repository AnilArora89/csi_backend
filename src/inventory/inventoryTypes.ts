export interface inventory {
    _id: string;
    routeNo: string;
    description: string;
    person: string;
    agencyNo: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
    lastCalibrationDates: Date[];
}
