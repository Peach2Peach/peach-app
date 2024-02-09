import crashlytics from "@react-native-firebase/crashlytics";

export const deleteUnsentReports = () => crashlytics().deleteUnsentReports();
