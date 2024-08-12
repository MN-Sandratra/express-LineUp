import LogModel from '../models/log';

export default class Log {
    private logData: any;

    constructor() {
        this.initializeLog();
    }

    private async initializeLog() {
        const logExists = await LogModel.exists({});
        if (!logExists) {
            const newLog = new LogModel({
                iteration: 0,
                data: [],
                date: new Date()
            });
            await newLog.save();
            console.log('\nLog initialized with new instance!');
        } else {
            console.log('\nLog initialized with previous instance!');
            const log = await LogModel.findOne({});
            if (log && !this.datesAreOnSameDay(new Date(log.date), new Date())) {
                this.resetLog();
            }
        }
    }

    public async resetLog() {
        await LogModel.updateOne({}, {
            $set: {
                iteration: 0,
                data: [],
                date: new Date()
            }
        });
        console.log('\nReset of the log system succeeded!');
    }

    public async updateData(data: any[]) {
        await LogModel.updateOne({}, {
            $set: {
                data: data,
                date: new Date()
            }
        });
        console.log('\nData updated!');
    }

    public async updateIteration(iteration: number) {
        await LogModel.updateOne({}, {
            $set: {
                iteration: iteration,
                date: new Date()
            }
        });
        console.log('\nIteration updated!');
    }

    public async getData(): Promise<any> {
        const log = await LogModel.findOne({});
        return log ? log.data : null;
    }

    public async getIteration(): Promise<number> {
        const log = await LogModel.findOne({});
        return log ? log.iteration : 0;
    }

    private datesAreOnSameDay(first: Date, second: Date): boolean {
        return this.formatDate(first) === this.formatDate(second);
    }

    private formatDate(obj: Date): string {
        return `${obj.getFullYear()}/${obj.getMonth() + 1}/${obj.getDate()}`;
    }
}
