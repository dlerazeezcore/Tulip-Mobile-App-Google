export const authService = {
  async signup(_phoneNumber: string, _name: string, _email: string) {
    return { success: true, message: 'Mock Signup Success' };
  },

  async login(_phoneNumber: string) {
    return { success: true, message: 'Mock Login Success' };
  },

  async verifyOtp(_phoneNumber: string, _otp: string) {
    return { success: true, token: 'mock_token_abc' };
  }
};
