import { CurrentTierChartRadial } from '@/components/dashboard/current-tier-radial-chart';
import { DailyUsageBarChart } from '@/components/dashboard/daily-usage-bar-chart';
import { DailyUsageRadialChart } from '@/components/dashboard/daily-usage-radial-chart';

const AnalyticsPage = () => {
    return (
        <div className='p-4 flex flex-col gap-4'>
            <div>
                <DailyUsageBarChart />
            </div>

            {/* TODO: Dont do any thing for now */}
            <div className='flex items-center gap-4'>
                <div>
                    <DailyUsageRadialChart />
                </div>
                <div>
                    <CurrentTierChartRadial />
                </div>
            </div>

        </div>
    )
}

export default AnalyticsPage;