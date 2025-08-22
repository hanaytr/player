import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, Users } from "lucide-react";
import { UserProfile } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProfileSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: UserProfile) => void;
}

export default function ProfileSelector({ isOpen, onClose, onSelectProfile }: ProfileSelectorProps) {
  const { toast } = useToast();
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  
  const [newProfile, setNewProfile] = useState({
    profileName: "",
    avatarUrl: "",
    ageRating: 18,
    pin: "",
    isChild: false,
  });

  const { data: profiles = [] } = useQuery<UserProfile[]>({
    queryKey: ["/api/user-profiles/user-1"],
  });

  const createProfileMutation = useMutation({
    mutationFn: (profile: any) => apiRequest("/api/user-profiles", "POST", profile),
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "New profile has been created successfully.",
      });
      setShowCreateProfile(false);
      setNewProfile({ profileName: "", avatarUrl: "", ageRating: 18, pin: "", isChild: false });
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles/user-1"] });
    },
  });

  const handleProfileSelect = (profile: UserProfile) => {
    if (profile.pin) {
      setSelectedProfile(profile);
      setShowPinDialog(true);
    } else {
      onSelectProfile(profile);
      onClose();
    }
  };

  const handlePinSubmit = () => {
    if (selectedProfile && pin === selectedProfile.pin) {
      onSelectProfile(selectedProfile);
      onClose();
      setPin("");
      setShowPinDialog(false);
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct PIN for this profile.",
        variant: "destructive",
      });
    }
  };

  const handleCreateProfile = () => {
    if (!newProfile.profileName) {
      toast({
        title: "Error",
        description: "Please enter a profile name.",
        variant: "destructive",
      });
      return;
    }

    createProfileMutation.mutate({
      ...newProfile,
      userId: "user-1",
    });
  };

  const getAvatarOptions = () => [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1494790108755-2616b612b790?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  ];

  return (
    <>
      <Dialog open={isOpen && !showCreateProfile && !showPinDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Select Profile
            </DialogTitle>
            <DialogDescription>
              Choose a profile to continue with your personalized experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {profiles.map((profile) => (
              <Card 
                key={profile.id}
                className="cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleProfileSelect(profile)}
                data-testid={`profile-${profile.id}`}
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={profile.avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl">
                      {profile.profileName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-bold text-lg mb-2">{profile.profileName}</h3>
                  
                  <div className="space-y-2">
                    {profile.isChild && (
                      <Badge variant="secondary">Child Profile</Badge>
                    )}
                    {profile.pin && (
                      <div className="flex items-center justify-center text-sm text-gray-400">
                        <Lock className="w-4 h-4 mr-1" />
                        PIN Protected
                      </div>
                    )}
                    <div className="text-sm text-gray-400">
                      Age Rating: {profile.ageRating}+
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card 
              className="cursor-pointer hover:bg-gray-800 transition-colors border-dashed"
              onClick={() => setShowCreateProfile(true)}
              data-testid="button-add-profile"
            >
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="font-bold text-lg">Add Profile</h3>
                <p className="text-sm text-gray-400">Create a new profile</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Profile Dialog */}
      <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Set up a personalized profile with custom settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input
                id="profile-name"
                value={newProfile.profileName}
                onChange={(e) => setNewProfile(prev => ({ ...prev, profileName: e.target.value }))}
                placeholder="Enter profile name"
                data-testid="input-profile-name"
              />
            </div>

            <div className="space-y-2">
              <Label>Choose Avatar</Label>
              <div className="grid grid-cols-3 gap-3">
                {getAvatarOptions().map((avatar, index) => (
                  <Avatar 
                    key={index}
                    className={`w-16 h-16 cursor-pointer border-2 ${
                      newProfile.avatarUrl === avatar ? 'border-samsung-blue' : 'border-transparent'
                    }`}
                    onClick={() => setNewProfile(prev => ({ ...prev, avatarUrl: avatar }))}
                    data-testid={`avatar-${index}`}
                  >
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age-rating">Age Rating</Label>
                <select
                  id="age-rating"
                  value={newProfile.ageRating}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, ageRating: parseInt(e.target.value) }))}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  data-testid="select-age-rating"
                >
                  <option value={0}>All Ages</option>
                  <option value={7}>7+</option>
                  <option value={13}>13+</option>
                  <option value={16}>16+</option>
                  <option value={18}>18+</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-pin">PIN (Optional)</Label>
                <Input
                  id="profile-pin"
                  type="password"
                  value={newProfile.pin}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, pin: e.target.value }))}
                  placeholder="4-digit PIN"
                  maxLength={4}
                  data-testid="input-profile-pin"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-child"
                checked={newProfile.isChild}
                onChange={(e) => setNewProfile(prev => ({ ...prev, isChild: e.target.checked }))}
                className="rounded"
                data-testid="checkbox-is-child"
              />
              <Label htmlFor="is-child">This is a child profile</Label>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateProfile}
                disabled={createProfileMutation.isPending}
                className="flex-1"
                data-testid="button-create-profile"
              >
                Create Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateProfile(false)}
                className="flex-1"
                data-testid="button-cancel-create"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Entry Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enter PIN</DialogTitle>
            <DialogDescription>
              This profile is protected. Please enter the PIN to continue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedProfile && (
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={selectedProfile.avatarUrl || undefined} />
                  <AvatarFallback className="text-xl">
                    {selectedProfile.profileName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold">{selectedProfile.profileName}</h3>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pin-input">PIN</Label>
              <Input
                id="pin-input"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
                data-testid="input-pin"
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handlePinSubmit}
                disabled={pin.length !== 4}
                className="flex-1"
                data-testid="button-submit-pin"
              >
                Unlock Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPinDialog(false);
                  setPin("");
                  setSelectedProfile(null);
                }}
                className="flex-1"
                data-testid="button-cancel-pin"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}