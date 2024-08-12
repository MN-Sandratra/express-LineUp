import Log from './log';
import Service from './service';
import Print from './print';

export default class Manager {
    private log: Log;
    private data: any;
    private service: Service;
    private iteration: number;
    private evaluation: number[];
    private print: Print;

    constructor() {
        this.log = new Log();
        this.service = new Service();
        this.print = new Print();
        this.evaluation = [];
        this.iteration = 0;
        this.data = [];
        this.initialize();
    }

    private async initialize() {
        this.data = await this.log.getData();
        this.iteration = await this.log.getIteration();
        this.Evaluate();
    }

    private async Evaluate() {
        let total = this.data.length;
        this.data.forEach((element: any) => {
            element.evaluation = element.content.length / total;
        });
    }

    private async getFree(cat: number): Promise<number> {
        let free = -1;
        if (this.data.length > 0) {
            this.Evaluate();
            let max = 99999;
            this.data.forEach((element: any, index: number) => {
                if (max > element.evaluation && element.free && element.type == cat) {
                    free = index;
                    max = element.evaluation;
                }
            });
        }
        return free;
    }

    public async addCaisse(caisse: number, cat: number) {
        let test = true;
        const category = await this.service.getCat(cat);
        this.data.forEach((element: any) => {
            if (element.caisse === caisse && element.type === cat) {
                test = false;
                element.free = true;
            }
        });
        if (test && category) {
            this.data.push({
                caisse: caisse,
                free: true,
                content: [],
                evaluation: 0,
                category: category.category,
                type: category.type,
                id: category.id
            });
        }

        await this.log.updateData(this.data);
    }

    public async getCaisses() {
        this.data = await this.log.getData();
        return this.data;
    }

    public async getCaisse(caisse: string): Promise<any> {
        const tmp = caisse.split('-');
        this.data = await this.log.getData();
        for (let element of this.data) {
            if (element.caisse == parseInt(tmp[1]) && element.type == parseInt(tmp[0])) {
                await this.log.updateData(this.data);
                return element;
            }
        }
    }

    public async turnCaisse(caisse: number, cat: number): Promise<boolean> {
        this.data = await this.log.getData();
        for (let element in this.data) {
            if (this.data[element].caisse == caisse && this.data[element].type == cat) {
                this.data[element].free = !this.data[element].free;
                await this.log.updateData(this.data);
                return this.data[element].free;
            }
        };
        await this.log.updateData(this.data);
        return false;
    }

    public async getNumber(cat: number): Promise<Object> {
        const freeCaisseIndex = await this.getFree(cat);
        this.data = await this.log.getData();
        this.iteration = await this.log.getIteration();

        if (freeCaisseIndex != -1) {
            this.iteration++;
            const numero = this.iteration;
            const caisse = this.data[freeCaisseIndex];
            const date = new Date();
            const category = await this.service.getCat(cat);

            if (category) {
                caisse.content.push({
                    numero: numero,
                    date: date,
                    type: category.type
                });
                await this.log.updateData(this.data);
                await this.log.updateIteration(this.iteration);
                // this.print.printNumber(numero, category.id + '-' + this.data[freeCaisseIndex].caisse, category.category, new Date());
                return {
                    Caisse: this.data[freeCaisseIndex].caisse,
                    numero: numero,
                    date: date,
                    category: category.category
                };
            }
        } else {
            return {
                Caisse: 0,
                numero: 0,
                data: new Date(),
                category: 'null'
            };
        }
        return {};
    }

    public async removeNum(caisse: string) {
        this.data = await this.log.getData();
        let s = caisse.split('-');
        this.data.forEach((element: any) => {
            if (element.caisse == parseInt(s[1]) && element.type == parseInt(s[0])) {
                element.content.shift();
                return;
            }
        });
        await this.log.updateData(this.data);
    }

    public async deconnexion(caisse: number, cat: number) {
        this.data = await this.log.getData();
        let tmp = [];
        let test = false;
        for (let element in this.data) {
            if (this.data[element].caisse == caisse && this.data[element].type == cat) {
                if (this.data.length > 1) {
                    test = true;
                    tmp = this.data[element];
                }
                this.data.splice(element, 1);
                break;
            }
        }

        if (test) {
            this.fillCaissse(tmp);
        }

        await this.log.updateData(this.data);
    }

    private fillCaissse(content: any) {
        const len = this.data.length;
        let i = 0;
        let exist = false;
        const cat = content.id;
        for (let en of this.data) {
            if (en.type == cat) {
                exist = true;
                break;
            }
        }
        if (exist) {
            for (let e in content.content) {
                while (this.data[i % len].type != cat) {
                    i++;
                }
                if (this.data[i % len].type == cat) {
                    this.data[i % len].content.push(content.content[e]);
                }
                i++;
            }
        }
        this.reOrderNumberContent();
    }

    private reOrderNumberContent() {
        for (let id in this.data) {
            this.data[id].content = this.data[id].content.sort((a: any, b: any) => {
                return a.numero - b.numero;
            });
        }
    }

    public getCategory() {
        return this.service.getServices();
    }

    public async getCatName(cat: number) {
        return await this.service.getCat(cat);
    }

    public async getCatConn() {
        let obj = [];
        for (let el of this.data) {
            if (el.free) {
                obj.push(el.type);
            }
        }
        const tmp = new Set(obj);
        const tmpRes = [...tmp];
        return await Promise.all(tmpRes.map(async (e: any) => {
            const cat = await this.service.getCat(e);
            return {
                type: cat?.type,
                category: cat?.category,
                id: cat?.id
            };
        }));
    }

    public get services() {
        return this.service;
    }
}
