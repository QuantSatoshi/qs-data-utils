export declare function getDataFileName(channel: string, exchange: string, pairDb: string, startDate: string | Date | number): string;
export declare function attemptDownloadDataFile({ exchange, pair, startDate, channel, accessKey, dataFolder, }: {
    exchange: string;
    pair: string;
    startDate: string | Date;
    channel: string;
    accessKey: string;
    dataFolder: string;
}): Promise<string | null>;
