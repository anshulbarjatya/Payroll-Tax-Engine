import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService implements OnModuleInit {
  private readonly dataDir = path.join(process.cwd(), 'data');
  private cache = new Map<string, unknown[]>();

  onModuleInit(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getAll<T>(collection: string): T[] {
    if (!this.cache.has(collection)) {
      this.loadCollection(collection);
    }
    return (this.cache.get(collection) as T[]) ?? [];
  }

  findOne<T>(collection: string, predicate: (item: T) => boolean): T | undefined {
    return this.getAll<T>(collection).find(predicate);
  }

  findMany<T>(collection: string, predicate: (item: T) => boolean): T[] {
    return this.getAll<T>(collection).filter(predicate);
  }

  insert<T extends { id: string }>(collection: string, item: T): T {
    const items = this.getAll<T>(collection);
    if (items.some((existing) => existing.id === item.id)) {
      throw new Error(`Duplicate id in ${collection}: ${item.id}`);
    }
    items.push(item);
    this.persist(collection, items);
    return item;
  }

  update<T extends { id: string }>(
    collection: string,
    id: string,
    updater: (item: T) => T,
  ): T {
    const items = this.getAll<T>(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Record not found in ${collection}: ${id}`);
    }
    items[index] = updater(items[index]);
    this.persist(collection, items);
    return items[index];
  }

  private loadCollection(collection: string): void {
    const filePath = this.getFilePath(collection);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      this.cache.set(collection, JSON.parse(raw) as unknown[]);
    } else {
      this.cache.set(collection, []);
    }
  }

  private persist<T>(collection: string, items: T[]): void {
    this.cache.set(collection, items);
    fs.writeFileSync(this.getFilePath(collection), JSON.stringify(items, null, 2));
  }

  private getFilePath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }
}
