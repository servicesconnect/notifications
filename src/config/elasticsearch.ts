import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { Logger } from "winston";

import { envConfig, winstonLogger } from "@notifications/config";

const log: Logger = winstonLogger("notificationElasticSearchServer", "debug");

const elasticSearchClient = new Client({
  node: `${envConfig.elastic_search_url}`,
});

export async function startAndCheckElasticConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `NotificationService Elasticsearch health status - ${health.status}`
      );
      isConnected = true;
    } catch (error) {
      log.error("Connection to Elasticsearch failed. Retrying...");
      log.log("error", "NotificationService checkConnection() method:", error);
    }
  }
}
