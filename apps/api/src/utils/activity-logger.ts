import { ActivityEventType } from '@applytrack/shared';
import prisma from '../db/prisma';

interface CreateActivityLogParams {
  userId: string;
  jobApplicationId?: string;
  eventType: ActivityEventType;
  description: string;
  metadata?: Record<string, any>;
}

export const createActivityLog = async (params: CreateActivityLogParams) => {
  return prisma.activityLog.create({
    data: {
      userId: params.userId,
      jobApplicationId: params.jobApplicationId,
      eventType: params.eventType,
      description: params.description,
      metadata: params.metadata || null,
    },
  });
};
