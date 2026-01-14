import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ApplicationModalProps {
  application?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationModal({ application, onClose, onSuccess }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    company: application?.company || '',
    roleTitle: application?.roleTitle || '',
    location: application?.location || '',
    workMode: application?.workMode || 'remote',
    employmentType: application?.employmentType || 'fulltime',
    status: application?.status || 'wishlist',
    priority: application?.priority || 'medium',
    appliedDate: application?.appliedDate?.split('T')[0] || '',
    nextFollowUpDate: application?.nextFollowUpDate?.split('T')[0] || '',
    salaryTarget: application?.salaryTarget || '',
    link: application?.link || '',
    notes: application?.notes || '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (application) {
        return apiClient.updateApplication(application.id, data);
      } else {
        return apiClient.createApplication(data);
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data: any = {
      company: formData.company,
      roleTitle: formData.roleTitle,
      workMode: formData.workMode,
      employmentType: formData.employmentType,
      status: formData.status,
      priority: formData.priority,
    };

    if (formData.location) data.location = formData.location;
    if (formData.appliedDate) data.appliedDate = new Date(formData.appliedDate).toISOString();
    if (formData.nextFollowUpDate) data.nextFollowUpDate = new Date(formData.nextFollowUpDate).toISOString();
    if (formData.salaryTarget) data.salaryTarget = parseFloat(formData.salaryTarget);
    if (formData.link) data.link = formData.link;
    if (formData.notes) data.notes = formData.notes;

    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">
            {application ? 'Edit Application' : 'New Application'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role Title *</label>
              <Input
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Work Mode *</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                required
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Employment Type *</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                required
              >
                <option value="fulltime">Full-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="ghosted">Ghosted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority *</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Applied Date</label>
              <Input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Next Follow-up</label>
              <Input
                type="date"
                value={formData.nextFollowUpDate}
                onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Salary Target</label>
              <Input
                type="number"
                value={formData.salaryTarget}
                onChange={(e) => setFormData({ ...formData, salaryTarget: e.target.value })}
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Link</label>
              <Input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
