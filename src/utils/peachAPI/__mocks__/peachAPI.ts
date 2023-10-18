const acknowledgeDisputeMock = jest.fn().mockResolvedValue({ result: { success: true }, error: null })
export const peachAPI = {
  private: {
    contract: {
      acknowledgeDispute: (...args: unknown[]) => acknowledgeDisputeMock(...args),
    },
  },
}
