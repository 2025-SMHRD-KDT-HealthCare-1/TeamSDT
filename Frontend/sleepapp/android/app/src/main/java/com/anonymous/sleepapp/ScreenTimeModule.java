package com.anonymous.sleepapp;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.Calendar;
import java.util.List;

public class ScreenTimeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ScreenTimeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ScreenTime";
    }

    @ReactMethod
    public void getTodayScreenTime(Promise promise) {
        try {
            UsageStatsManager usm =
                    (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

            // 오늘 00시 계산
            Calendar calendar = Calendar.getInstance();
            long end = calendar.getTimeInMillis();

            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            long start = calendar.getTimeInMillis();

            List<UsageStats> stats =
                    usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end);

            long total = 0;

            for (UsageStats u : stats) {
                total += u.getTotalTimeInForeground();
            }

            promise.resolve(total);

        } catch (Exception e) {
            promise.reject("ERR_TOTAL", e);
        }
    }

    @ReactMethod
    public void getAppUsageStats(Promise promise) {
        try {
            UsageStatsManager usm =
                    (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

            PackageManager pm = reactContext.getPackageManager();

            Calendar calendar = Calendar.getInstance();
            long end = calendar.getTimeInMillis();

            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            long start = calendar.getTimeInMillis();

            List<UsageStats> stats =
                    usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end);

            WritableNativeArray result = new WritableNativeArray();

            for (UsageStats usage : stats) {

                long totalTime = usage.getTotalTimeInForeground();
                if (totalTime <= 0) continue;

                String appName;
                try {
                    ApplicationInfo info = pm.getApplicationInfo(usage.getPackageName(), 0);
                    appName = pm.getApplicationLabel(info).toString();
                } catch (Exception e) {
                    appName = usage.getPackageName();
                }

                int minutes = (int) (totalTime / 1000 / 60);

                WritableNativeMap map = new WritableNativeMap();
                map.putString("name", appName);
                map.putString("packageName", usage.getPackageName());
                map.putInt("minutes", minutes);

                result.pushMap(map);
            }

            promise.resolve(result);

        } catch (Exception e) {
            promise.reject("ERR_APPS", e);
        }
    }
}
