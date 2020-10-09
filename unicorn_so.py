from unicorn import *
from unicorn.arm64_const import *
import binascii
from capstone import *
from capstone.arm64 import *


md = Cs(CS_ARCH_ARM64, CS_MODE_ARM)
md.detail = True
reg_names = {
    UC_ARM64_REG_X0:  "X0",
    UC_ARM64_REG_X1:  "X1",
    UC_ARM64_REG_X2:  "X2",
    UC_ARM64_REG_X3:  "X3",
    UC_ARM64_REG_X4:  "X4",
    UC_ARM64_REG_X5:  "X5",
    UC_ARM64_REG_X6:  "X6",
    UC_ARM64_REG_X7:  "X7",
    UC_ARM64_REG_X8:  "X8",
    UC_ARM64_REG_X9:  "X9",
    UC_ARM64_REG_X10: "X10",
    UC_ARM64_REG_X11: "X11",
    UC_ARM64_REG_X12: "X12",
    UC_ARM64_REG_X13: "X13",
    UC_ARM64_REG_X14: "X14",
    UC_ARM64_REG_X15: "X15",
    UC_ARM64_REG_X16: "X16",
    UC_ARM64_REG_X17: "X17",
    UC_ARM64_REG_X18: "X18",
    UC_ARM64_REG_X19: "X19",
    UC_ARM64_REG_X20: "X20",
    UC_ARM64_REG_X21: "X21",
    UC_ARM64_REG_X22: "X22",
    UC_ARM64_REG_X23: "X23",
    UC_ARM64_REG_X24: "X24",
    UC_ARM64_REG_X25: "X25",
    UC_ARM64_REG_X26: "X26",
    UC_ARM64_REG_X27: "X27",
    UC_ARM64_REG_X28: "X28"
}
reg_status = None

def get_reg_info(uc : Uc):
    global reg_status
    retval = ""
    if reg_status is None:
        reg_status = {}
        
        for reg_name in range(UC_ARM64_REG_X0,UC_ARM64_REG_X28+1):
            reg_status[reg_names[reg_name]] = uc.reg_read(reg_name)
            retval += ("%s=0x%08X " %(reg_names[reg_name],reg_status[reg_names[reg_name]]))
    
    else:
        for reg_name in range(UC_ARM64_REG_X0,UC_ARM64_REG_X28+1):
            if  uc.reg_read(reg_name) != reg_status[reg_names[reg_name]]:
                reg_status[reg_names[reg_name]] = uc.reg_read(reg_name)
                retval += ("%s=0x%08X " %(reg_names[reg_name],reg_status[reg_names[reg_name]]))
    return retval




def hook_code(uc: Uc, address, size, user_data):
    reg_info = get_reg_info(uc)
    #pass
    user_data = uc.mem_read(address, size)
    for insn in md.disasm(user_data, size):
        print(reg_info)
        print("0x%08X:\t%s\t%s\t" % (address, insn.mnemonic, insn.op_str),end=" ")
        


    


if __name__ == "__main__":
    mu = Uc(UC_ARCH_ARM64, UC_MODE_ARM)

    # libnative-lib.so_0x7f8a1d6000_0x3000
    so_addr = 0x7f8a1d6000
    so_size = 0x3000 * 4

    mu.mem_map(so_addr, so_size)
    # stack
    stack_addr = so_addr + so_size
    stack_size = 0x3000 * 4
    stack_top = stack_addr + stack_size - 4  # 减4防止覆盖param

    mu.mem_map(stack_addr, stack_size)

    # param
    param_addr = stack_addr + stack_size
    param_size = 0x3000 * 4

    mu.mem_map(param_addr, param_size)

    with open('libnative-lib.so_0x7f8a1d6000_0x3000.so', 'rb') as f:
        so_data = f.read()

        mu.mem_write(so_addr, so_data)

        mu.reg_write(UC_ARM64_REG_SP, stack_addr)
        
        input_bytes = b'wcAS3LiZggUmvAxmEZMsHaL1sQpf8IJx8U01'
        mu.mem_write(param_addr, input_bytes)

        mu.reg_write(UC_ARM64_REG_X0, param_addr)
        mu.reg_write(UC_ARM64_REG_X1, len(input_bytes))

        func_start = so_addr + 0x00006DC
        func_end = so_addr + 0x00000DB0

        mu.hook_add(UC_HOOK_CODE, hook_code, begin=func_start, end=func_end)
        # 模拟开始
        mu.emu_start(func_start, func_end)

        result = mu.mem_read(param_addr, len(input)).decode()
        print("input: %s,output: %s" % (input, result))

    pass
