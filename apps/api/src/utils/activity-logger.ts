import { ActivityEventType } from '@applytrack/shared';
import prisma, { Prisma } from '../db/prisma';

interface CreateActivityLogParams {
  userId: string;
  jobApplicationId?: string;
  eventType: typeof ActivityEventType[keyof typeof ActivityEventType];
  description: string;
  metadata?: Record<string, unknown>;
}

export const createActivityLog = async (params: CreateActivityLogParams) => {
  return prisma.activityLog.create({
    data: {
      userId: params.userId,
      jobApplicationId: params.jobApplicationId,
      eventType: params.eventType,
      description: params.description,
      metadata: (params.metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });
};
