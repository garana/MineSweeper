
export abstract class PersistenceStore {

	abstract get(name: string): Promise<string>;

	abstract set(name: string, value: string): Promise<boolean>;

}
