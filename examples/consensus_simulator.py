import hashlib
import time
import random

class Block:
    def __init__(self, index, previous_hash, timestamp, data, nonce=0, validator=None):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.nonce = nonce
        self.validator = validator  # For PoS or PoA
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        hash_string = f"{self.index}{self.previous_hash}{self.timestamp}{self.data}{self.nonce}{self.validator or ''}"
        return hashlib.sha256(hash_string.encode()).hexdigest()

class Blockchain:
    def __init__(self, consensus='pow', difficulty=4, validators=None, stakes=None):
        self.consensus = consensus.lower()
        self.difficulty = difficulty  # For PoW
        self.validators = validators or []  # For PoA/PoS
        self.stakes = stakes or {}  # For PoS: dict of validator: stake
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, "0", time.time(), "Genesis Block")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, data):
        previous_hash = self.get_latest_block().hash
        if self.consensus == 'pow':
            new_block = self.mine_pow_block(len(self.chain), previous_hash, time.time(), data)
        elif self.consensus == 'pos':
            new_block = self.mine_pos_block(len(self.chain), previous_hash, time.time(), data)
        elif self.consensus == 'poa':
            new_block = self.mine_poa_block(len(self.chain), previous_hash, time.time(), data)
        else:
            raise ValueError("Unsupported consensus method")
        self.chain.append(new_block)

    def mine_pow_block(self, index, previous_hash, timestamp, data):
        nonce = 0
        while True:
            block = Block(index, previous_hash, timestamp, data, nonce)
            if block.hash[:self.difficulty] == '0' * self.difficulty:
                return block
            nonce += 1

    def mine_pos_block(self, index, previous_hash, timestamp, data):
        if not self.stakes:
            raise ValueError("No stakes defined for PoS")
        # Simple simulation: select validator probabilistically based on stake
        total_stake = sum(self.stakes.values())
        pick = random.uniform(0, total_stake)
        current = 0
        selected_validator = None
        for validator, stake in self.stakes.items():
            current += stake
            if current >= pick:
                selected_validator = validator
                break
        if not selected_validator:
            raise ValueError("No validator selected")
        return Block(index, previous_hash, timestamp, data, validator=selected_validator)

    def mine_poa_block(self, index, previous_hash, timestamp, data):
        if not self.validators:
            raise ValueError("No validators defined for PoA")
        # Simple: rotate validators or pick random authorized one
        selected_validator = random.choice(self.validators)
        return Block(index, previous_hash, timestamp, data, validator=selected_validator)

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            if current.hash != current.calculate_hash():
                return False
            if current.previous_hash != previous.hash:
                return False
            # Additional checks based on consensus could be added
        return True

# Example usage
def print_chain(blockchain):
    for block in blockchain.chain:
        print(f"Block {block.index}:")
        print(f"Hash: {block.hash}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Data: {block.data}")
        if block.validator:
            print(f"Validator: {block.validator}")
        print(f"Nonce: {block.nonce}")
        print("---")

# PoW Example
print("Proof of Work Blockchain:")
pow_chain = Blockchain(consensus='pow', difficulty=2)  # Lower difficulty for quick demo
pow_chain.add_block("Transaction 1")
pow_chain.add_block("Transaction 2")
print_chain(pow_chain)
print(f"Chain valid: {pow_chain.is_chain_valid()}\n")

# PoS Example
print("Proof of Stake Blockchain:")
stakes = {"Validator1": 100, "Validator2": 200, "Validator3": 50}
pos_chain = Blockchain(consensus='pos', stakes=stakes)
pos_chain.add_block("Transaction 1")
pos_chain.add_block("Transaction 2")
print_chain(pos_chain)
print(f"Chain valid: {pos_chain.is_chain_valid()}\n")

# PoA Example
print("Proof of Authority Blockchain:")
validators = ["Authority1", "Authority2"]
poa_chain = Blockchain(consensus='poa', validators=validators)
poa_chain.add_block("Transaction 1")
poa_chain.add_block("Transaction 2")
print_chain(poa_chain)
print(f"Chain valid: {poa_chain.is_chain_valid()}\n")