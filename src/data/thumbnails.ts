import thumbStockTracker from "@/assets/thumb-stock-tracker.jpg";
import thumbInvoiceMaker from "@/assets/thumb-invoice-maker.jpg";
import thumbShiftScheduler from "@/assets/thumb-shift-scheduler.jpg";
import thumbExpenseLog from "@/assets/thumb-expense-log.jpg";
import thumbMenuBuilder from "@/assets/thumb-menu-builder.jpg";
import thumbAttendanceApp from "@/assets/thumb-attendance-app.jpg";
import thumbPosLite from "@/assets/thumb-pos-lite.jpg";
import thumbBookingPage from "@/assets/thumb-booking-page.jpg";

import screenStockTracker2 from "@/assets/screen-stock-tracker-2.jpg";
import screenStockTracker3 from "@/assets/screen-stock-tracker-3.jpg";
import screenInvoiceMaker2 from "@/assets/screen-invoice-maker-2.jpg";
import screenInvoiceMaker3 from "@/assets/screen-invoice-maker-3.jpg";
import screenShiftScheduler2 from "@/assets/screen-shift-scheduler-2.jpg";
import screenExpenseLog2 from "@/assets/screen-expense-log-2.jpg";
import screenMenuBuilder2 from "@/assets/screen-menu-builder-2.jpg";
import screenAttendance2 from "@/assets/screen-attendance-2.jpg";
import screenPosLite2 from "@/assets/screen-pos-lite-2.jpg";
import screenBookingPage2 from "@/assets/screen-booking-page-2.jpg";

export const thumbnails: Record<string, string> = {
  "stock-tracker": thumbStockTracker,
  "invoice-maker": thumbInvoiceMaker,
  "shift-scheduler": thumbShiftScheduler,
  "expense-log": thumbExpenseLog,
  "menu-builder": thumbMenuBuilder,
  "attendance-app": thumbAttendanceApp,
  "pos-lite": thumbPosLite,
  "booking-page": thumbBookingPage,
};

export const screenshots: Record<string, string[]> = {
  "stock-tracker": [thumbStockTracker, screenStockTracker2, screenStockTracker3],
  "invoice-maker": [thumbInvoiceMaker, screenInvoiceMaker2, screenInvoiceMaker3],
  "shift-scheduler": [thumbShiftScheduler, screenShiftScheduler2],
  "expense-log": [thumbExpenseLog, screenExpenseLog2],
  "menu-builder": [thumbMenuBuilder, screenMenuBuilder2],
  "attendance-app": [thumbAttendanceApp, screenAttendance2],
  "pos-lite": [thumbPosLite, screenPosLite2],
  "booking-page": [thumbBookingPage, screenBookingPage2],
};
