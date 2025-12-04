package app.api;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import com.facebook.react.bridge.*;
import java.util.*;

public class UsageStatsModule extends ReactContextBaseJavaModule {
    UsageStatsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "UsageStatsModule";
    }

    @ReactMethod
    public void getUsageStats(Promise promise) {
        UsageStatsManager usm = (UsageStatsManager)
            getReactApplicationContext().getSystemService(Context.USAGE_STATS_SERVICE);

        long endTime = System.currentTimeMillis();
        long startTime = endTime - 1000 * 60 * 60 * 24;

        List<UsageStats> stats = usm.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY, startTime, endTime
        );

        WritableArray result = Arguments.createArray();

        for (UsageStats us : stats) {
            long minutes = us.getTotalTimeInForeground() / 60000;
            if (minutes > 0) {
                WritableMap map = Arguments.createMap();
                map.putString("packageName", us.getPackageName());
                map.putString("name", us.getPackageName()); // 앱 이름은 추후 처리
                map.putInt("minutes", (int) minutes);
                map.putString("color", "#FFD700");
                result.pushMap(map);
            }
        }

        promise.resolve(result);
    }
}
