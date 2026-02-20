import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Clip {
    id: string;
    startTime: bigint;
    title: string;
    thumbnailUrl: string;
    endTime: bigint;
    createdAt: Time;
    videoUrl: string;
}
export type Time = bigint;
export interface backendInterface {
    deleteClip(clipId: string): Promise<void>;
    getAllClips(): Promise<Array<Clip>>;
    getClipById(clipId: string): Promise<Clip>;
    saveClip(title: string, videoUrl: string, thumbnailUrl: string, startTime: bigint, endTime: bigint): Promise<string>;
}
