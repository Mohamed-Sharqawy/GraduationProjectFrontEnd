using Homy.Application.Contract_Service.ApiServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Homy.api.BackgroundServices
{
    public class SubscriptionExpiryBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SubscriptionExpiryBackgroundService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(24); // Run once per day

        public SubscriptionExpiryBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<SubscriptionExpiryBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Subscription Expiry Background Service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Running subscription expiry checks at: {time}", DateTimeOffset.Now);

                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var subscriptionService = scope.ServiceProvider
                            .GetRequiredService<ISubscriptionApiService>();

                        // Process expiring subscriptions (3 days warning)
                        await subscriptionService.ProcessExpiringSubscriptionsAsync();
                        _logger.LogInformation("Processed expiring subscriptions.");

                        // Process expired subscriptions
                        await subscriptionService.ProcessExpiredSubscriptionsAsync();
                        _logger.LogInformation("Processed expired subscriptions.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while processing subscription expiry.");
                }

                // Wait 24 hours before next check
                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Subscription Expiry Background Service stopped.");
        }
    }
}
